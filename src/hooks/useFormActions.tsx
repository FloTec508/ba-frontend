import { useConfigService } from "@/services/config";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useSelector } from "react-redux";

export function useFormActions(form: UseFormReturn<any>) {
  const { setConfig } = useConfigService();
  const { config } = useSelector((state: any) => state.config);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      form.reset({ ...config });
    })();
  }, [config]);

  const onSubmitHandler = form.handleSubmit(async (values) => {
    setLoading(true);
    const dirty = form.formState.dirtyFields;
    const getDirtyValues = (dirtyFields: any, allValues: any): any => {
      if (dirtyFields === true) return allValues;
      return Object.keys(dirtyFields).reduce((acc, key) => {
        if (dirtyFields[key]) {
          acc[key] = getDirtyValues(dirtyFields[key], allValues[key]);
        }
        return acc;
      }, {} as any);
    };
    const changedValues = getDirtyValues(dirty, values);
    await setConfig(changedValues);
    setLoading(false);
  });

  return { onSubmitHandler, loading };
}
