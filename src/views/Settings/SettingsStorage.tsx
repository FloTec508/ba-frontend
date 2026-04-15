import { useFormActions } from "@/hooks/useFormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";

const optionalString = (minLength: number, message: string) =>
  z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val))
    .refine((val) => !val || val.length >= minLength, { message });

export const formSchema = z.object({
  storage: z
    .object({
      username: optionalString(3, "Username must be at least 3 characters").nullable(),
      password: optionalString(6, "Password must be at least 6 characters").nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.password && !data.username) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username is required when password is provided",
          path: ["username"],
        });
      }
    }),
});

const SettingsStorage= () => {
  const form = useForm<z.input<typeof formSchema>, any, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="Sharing"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonSave onClick={onSubmitHandler} isLoading={loading} />
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmitHandler} className="space-y-6 max-w-md">
          <div className="lg:px-0 px-6 py-3 lg:w-90">
            <div>
              <h2 className="mt-3 mb-3 text-xl">Authentication</h2>
            </div>
            <div className="pt-2 pb-4 text-secondary">
              To access shared folders on BerryAudio OS, users will be required to use the credentials below. Leave blank for no authentication.
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="storage.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="storage.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </Page>
  );
};

export default SettingsStorage;
