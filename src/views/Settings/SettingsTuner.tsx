import { zodResolver } from "@hookform/resolvers/zod";
import { useFormActions } from "@/hooks/useFormActions";
import { useForm } from "react-hook-form";
import { InputNumber } from "@/components/Form/InputNumber";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectSampleRate from "@/components/Form/SelectSampleRate";
import SelectAlsaDevices from "@/components/Form/SelectAlsaDevices";
import { Input } from "@/components/ui/input";

export const formSchema = z.object({
  tuner: z.object({
    input_device: z.string().nullable(),
    sample_rate: z.number().min(1, "Sample rate is required"),
    gain: z.number(),
  }),
});

const SettingsTuner = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="Tuner"
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
                name="tuner.input_device"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Tuner</FormLabel>
                    <FormControl>
                      <Input placeholder="Si470x" value="Si4703" disabled/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="tuner.input_device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Input device</FormLabel>
                    <div className="pb-4 text-secondary">Tuner audio will be captured from the following device. Works on souncards with ADC</div>
                    <FormControl>
                      <SelectAlsaDevices placeholder="Select Device" {...field} cmd="arecord" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="tuner.sample_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Sample Rate (Hz)</FormLabel>
                    <div className="pb-4 text-secondary">Capture sample rate. Check your ADC specifications for supported sample rates.</div>
                    <FormControl>
                      <SelectSampleRate placeholder="Select sample rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="tuner.gain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Default Gain (dB)</FormLabel>
                    <FormControl>
                      <InputNumber {...field} max={20} min={-20} />
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

export default SettingsTuner;
