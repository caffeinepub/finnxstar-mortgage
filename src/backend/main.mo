import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Lead = {
    name : Text;
    email : Text;
    phone : Text;
    loanType : Text;
    timestamp : Int;
  };

  module Lead {
    public func compareByTimestamp(a : Lead, b : Lead) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type BlogPost = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    author : Text;
    imageUrl : Text;
    category : Text;
    publishedAt : Int;
  };

  module BlogPost {
    public func compareByPublishedAtDesc(a : BlogPost, b : BlogPost) : Order.Order {
      Int.compare(b.publishedAt, a.publishedAt);
    };
  };

  let leads = List.empty<Lead>();
  var nextPostId = 1;
  let blogPosts = Map.empty<Nat, BlogPost>();

  public shared ({ caller }) func submitLead(name : Text, email : Text, phone : Text, loanType : Text, timestamp : Int) : async Bool {
    let newLead : Lead = {
      name;
      email;
      phone;
      loanType;
      timestamp;
    };

    leads.add(newLead);
    true;
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    leads.toArray().sort(Lead.compareByTimestamp);
  };

  public shared ({ caller }) func createPost(title : Text, excerpt : Text, content : Text, author : Text, imageUrl : Text, category : Text, publishedAt : Int) : async BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    let post : BlogPost = {
      id = nextPostId;
      title;
      excerpt;
      content;
      author;
      imageUrl;
      category;
      publishedAt;
    };

    blogPosts.add(nextPostId, post);

    nextPostId += 1;
    post;
  };

  public query ({ caller }) func getAllPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort(BlogPost.compareByPublishedAtDesc);
  };

  public query ({ caller }) func getPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    if (not blogPosts.containsKey(id)) {
      Runtime.trap("Post not found");
    };

    blogPosts.remove(id);
  };
};
