import { zodResolver } from "@hookform/resolvers/zod";
import { useFormActions } from "@/hooks/useFormActions";
import { useForm } from "react-hook-form";
import { InputNumber } from "@/components/Form/InputNumber";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectSampleRate from "@/components/Form/SelectSampleRate";

export const formSchema = z.object({
  dsp: z.object({
    resample_rate: z.number().nullable(),
    default_gain: z.number(),
  }),
});

const SettingsDsp = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="DSP"
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
                name="dsp.default_gain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Default Gain (dB)</FormLabel>
                    <div className="pb-4 text-secondary">
                      Default gain applied to all sources. <br></br>Use this to control clipping globally.
                    </div>
                    <FormControl>
                      <InputNumber {...field} max={20} min={-20} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="dsp.resample_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Resample Rate (Hz)</FormLabel>
                    <div className="pb-4 text-secondary">
                      ‘No Resampling’ adjusts DSP sample rate dynamically as needed for Bit perfect audio. Multiroom client may often disconnect to
                      adjust sample rate. <br></br>(Recommended) Fixed resample rate - make sure your sound card supports the required sample rate
                      before enabling.
                    </div>
                    <FormControl>
                      <SelectSampleRate placeholder="No Resampling" {...field} />
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

export default SettingsDsp;
