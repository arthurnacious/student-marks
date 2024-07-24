"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/use-confirm";
import { client } from "@/lib/hono";
import { courseWithRelations } from "@/types/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
interface courseType extends courseWithRelations {}

interface Props {
  course: courseType;
  disabled?: boolean;
}

const ManageFields: React.FC<Props> = ({ course, disabled = false }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action cannot be undone",
  });

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: async (fieldId) => {
      const response = await client.api.fields[":id"].$delete({
        param: { id: fieldId },
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Field successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", course.slug] });
      router.refresh();
    },
    onError: (error: any) => {
      toast.error("failed to delete field");
    },
  });

  return (
    <div className="mt-10">
      <ConfirmationDialog />
      {course.fields.length > 0 ? (
        <>
          <h3>Manage Existing</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.fields.map(({ id, name, total }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="font-medium">{total}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      disabled={deleteMutation.isPending || disabled}
                      size="sm"
                      onClick={async () => {
                        const ok = await confirm();

                        if (ok) {
                          deleteMutation.mutate(id);
                        }
                      }}
                    >
                      <Trash2 className="size-4 mr-2" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <p className="text-slate-300">
          There are no fields for this course, feel free to add some.
        </p>
      )}
    </div>
  );
};

export default ManageFields;
