import { useFormActions } from "@/hooks/useFormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import SelectTimezone from "@/components/Form/SelectTimezone";
import ButtonSave from "@/components/Button/ButtonSave";
import ButtonThemeToggle from "@/components/Button/ButtonThemeToggle";

export const formSchema = z.object({
  system: z.object({
    hostname: z.string().min(1, "Hostname is required"),
    timezone: z.string().min(6, "Timezone is required"),
  }),
  playback: z.object({
    background_albumart: z.boolean(),
  }),
});

const SettingsGeneral = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="General"
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
            <div className="mb-6">
              <FormField
                control={form.control}
                name="system.hostname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Hostname</FormLabel>
                    <div className="pb-4 text-secondary">
                      Used by Berryaudio OS Player as the device name for Spotify, AirPlay, Bluetooth, and browser access.{" "}
                    </div>
                    <FormControl>
                      <Input placeholder="Device Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="system.timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Timezone</FormLabel>
                    <FormControl>
                      <SelectTimezone placeholder="Select Timezone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="playback.background_albumart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Now Playing Background Album Art</FormLabel>
                    <div className="pb-4 text-secondary">Shows or hides blurred album art in the background on the Now Playing screen</div>
                    <FormControl>
                      <Switch {...field} value={field.value ?? false} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormItem>
                <FormLabel className="text-md block font-medium">Theme</FormLabel>
                <FormControl>
                  <ButtonThemeToggle />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </div>
        </form>
      </Form>
    </Page>
  );
};

export default SettingsGeneral;
