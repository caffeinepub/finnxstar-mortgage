import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Seed the owner's principal as admin on first deploy
  let ownerPrincipal = Principal.fromText("ewdvf-tqdpb-buvhb-ymfy4-b3k7w-fhtdv-hlwlz-zcnsm-ufko2-5phm3-kae");
  accessControlState.userRoles.add(ownerPrincipal, #admin);
  accessControlState.adminAssigned := true;

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
    slug : Text;
    metaTitle : Text;
    metaDescription : Text;
    metaKeywords : Text;
  };

  module BlogPost {
    public func compareByPublishedAtDesc(a : BlogPost, b : BlogPost) : Order.Order {
      Int.compare(b.publishedAt, a.publishedAt);
    };
  };

  type BlogPostInput = {
    title : Text;
    excerpt : Text;
    content : Text;
    author : Text;
    imageUrl : Text;
    category : Text;
    publishedAt : Int;
    slug : Text;
    metaTitle : Text;
    metaDescription : Text;
    metaKeywords : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let leads = List.empty<Lead>();
  var nextPostId = 1;
  let blogPosts = Map.empty<Nat, BlogPost>();
  let slugIndex = Map.empty<Text, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Lead Management
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

  // Blog Post Management
  public shared ({ caller }) func createPost(input : BlogPostInput) : async BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    if (slugIndex.containsKey(input.slug)) {
      Runtime.trap("Slug already exists");
    };

    let post : BlogPost = {
      id = nextPostId;
      title = input.title;
      excerpt = input.excerpt;
      content = input.content;
      author = input.author;
      imageUrl = input.imageUrl;
      category = input.category;
      publishedAt = input.publishedAt;
      slug = input.slug;
      metaTitle = input.metaTitle;
      metaDescription = input.metaDescription;
      metaKeywords = input.metaKeywords;
    };

    blogPosts.add(nextPostId, post);
    slugIndex.add(input.slug, nextPostId);

    nextPostId += 1;
    post;
  };

  public shared ({ caller }) func updatePost(id : Nat, input : BlogPostInput) : async BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    switch (blogPosts.get(id)) {
      case null { Runtime.trap("Post not found") };
      case (?existing) {
        if (input.slug != existing.slug and slugIndex.containsKey(input.slug)) {
          Runtime.trap("Slug already exists");
        };

        let updated : BlogPost = {
          id = existing.id;
          title = input.title;
          excerpt = input.excerpt;
          content = input.content;
          author = input.author;
          imageUrl = input.imageUrl;
          category = input.category;
          publishedAt = existing.publishedAt;
          slug = input.slug;
          metaTitle = input.metaTitle;
          metaDescription = input.metaDescription;
          metaKeywords = input.metaKeywords;
        };
        blogPosts.add(id, updated);

        if (input.slug != existing.slug) {
          slugIndex.remove(existing.slug);
          slugIndex.add(input.slug, id);
        };
        updated;
      };
    };
  };

  public query ({ caller }) func getAllPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort(BlogPost.compareByPublishedAtDesc);
  };

  public query ({ caller }) func getPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };

  public query ({ caller }) func getPostBySlug(slug : Text) : async ?BlogPost {
    switch (slugIndex.get(slug)) {
      case (null) { null };
      case (?id) { blogPosts.get(id) };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existing) {
        slugIndex.remove(existing.slug);
        blogPosts.remove(id);
      };
    };
  };
};
