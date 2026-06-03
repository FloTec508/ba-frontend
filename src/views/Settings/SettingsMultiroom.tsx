import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormActions } from "@/hooks/useFormActions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { InputNumber } from "@/components/Form/InputNumber";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectCodec from "@/components/Form/SelectCodec";

export const formSchema = z.object({
  multiroom: z.object({
    server: z.boolean(),
    codec: z.string().min(1),
    chunk: z.number(),
    buffer: z.number(),
  }),
});

const SettingsMultiroom = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="Multiroom"
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
              <h2 className="mt-3 mb-3 text-xl">Server</h2>
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="multiroom.server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Enable Server</FormLabel>
                    <FormControl>
                      <Switch {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="multiroom.codec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Codec</FormLabel>
                    <FormControl>
                      <SelectCodec placeholder="Select Codec" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="multiroom.chunk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Chunk (ms)</FormLabel>
                    <FormControl>
                      <InputNumber {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="multiroom.buffer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Buffer</FormLabel>
                    <FormControl>
                      <InputNumber {...field} />
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

export default SettingsMultiroom;
