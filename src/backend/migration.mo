import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type Lead = {
    name : Text;
    email : Text;
    phone : Text;
    loanType : Text;
    timestamp : Int;
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

  type OldActor = {
    leads : List.List<Lead>;
  };

  type NewActor = {
    leads : List.List<Lead>;
    nextPostId : Nat;
    blogPosts : Map.Map<Nat, BlogPost>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      nextPostId = 1;
      blogPosts = Map.empty<Nat, BlogPost>();
    };
  };
};
