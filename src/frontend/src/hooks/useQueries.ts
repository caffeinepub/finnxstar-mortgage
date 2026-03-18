import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitLead() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      loanType: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitLead(
        data.name,
        data.email,
        data.phone,
        data.loanType,
        BigInt(Date.now()),
      );
    },
  });
}

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["post", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      excerpt: string;
      content: string;
      author: string;
      imageUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(
        data.title,
        data.excerpt,
        data.content,
        data.author,
        data.imageUrl,
        data.category,
        BigInt(Date.now()),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}
