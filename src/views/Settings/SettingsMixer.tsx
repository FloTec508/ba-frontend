import { useState } from "react";
import { useFormActions } from "@/hooks/useFormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputNumber } from "@/components/Form/InputNumber";
import { AlsaDevice } from "@/types";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectAlsaDevices from "@/components/Form/SelectAlsaDevices";
import SelectAlsaVolumeDevice from "@/components/Form/SelectAlsaVolumeDevice";

export const formSchema = z.object({
  mixer: z.object({
    hw_device: z
      .string()
      .nullable()
      .refine((val) => val !== null && val.length > 0, {
        message: "Audio output device is required",
      }),
    volume_default: z.number(),
    volume_device: z.string(),
    dtoverlay: z.string().nullable(),
  }),
});

const SettingsMixer = () => {
  const [selectedCard, setSelectedCard] = useState<AlsaDevice["card"]>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="Mixer"
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
                name="mixer.hw_device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Soundcard</FormLabel>
                    <div className="pb-4 text-secondary">This is your default DAC. All audio will be played through this device.</div>
                    <FormControl>
                      <SelectAlsaDevices
                        placeholder="Select Device"
                        {...field}
                        onSelectedCard={(device: AlsaDevice) => {
                          setSelectedCard(device.card);
                          form.setValue("mixer.dtoverlay", device.dtoverlay ?? "", { shouldDirty: true });
                        }}
                        cmd="aplay"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.dtoverlay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">DT Overlay</FormLabel>
                    <div className="pb-4 text-secondary">
                      Automatically loaded from our dictionary. If not, you can manually configure it here. Please refer to your DAC manufacturer’s
                      documentation for more details.
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.volume_device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Volume Device</FormLabel>
                    <div className="pb-4 text-secondary">Select the hardware that controls the volume. Some DACs dont offer hardware volume use software instead.</div>
                    <FormControl>
                      <SelectAlsaVolumeDevice placeholder="Select Volume" card={selectedCard} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.volume_default"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium">Default Volume</FormLabel>
                    <FormControl>
                      <InputNumber {...field} max={100} />
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

export default SettingsMixer;
