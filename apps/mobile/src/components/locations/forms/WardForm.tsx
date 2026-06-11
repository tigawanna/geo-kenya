import { updateWardMutationOptions } from "@/data-access-layer/wards-mutation-options";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { useSnackbarStore } from "@/lib/react-native-paper/snackbar/global-snackbar-store";
import { logger } from "@/utils/logger";
import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";

interface WardFormProps {
  ward: KenyaWardsSelect;
}
export function WardForm({ ward }: WardFormProps) {
  const router = useRouter();
  const mutation = useMutation(updateWardMutationOptions());
  const { showSnackbar } = useSnackbarStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<KenyaWardsSelect>({
    defaultValues: ward,
  });

  const onSubmit = (data: KenyaWardsSelect) => {
    console.log("Ward data:", data);
    mutation.mutate(
      { id: ward.id, data },
      {
        onSuccess: (data) => {
          if (data.error) {
            showSnackbar(data.error);
            logger.log("Error updating ward:", data.error)
            return;
          }
          if (!data.result) {
            showSnackbar("Something went wrong");
            return;
          }
          router.back();
          showSnackbar("Updated succesfully");
        },
      }
    );
  };

  return (
    <KeyboardAwareScrollView extraHeight={70} style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="headlineMedium" style={styles.title}>
          Edit Ward
        </Text>
        <View style={styles.spacer} />
      </View>
      <Text variant="bodyMedium" style={styles.description}>
        Update any wrong info you notice
      </Text>
      <Controller
        control={control}
        name="ward"
        rules={{ required: "Ward name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Ward *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            error={!!errors.ward}
            style={styles.input}
          />
        )}
      />
      {errors.ward && <Text style={styles.error}>{errors.ward.message}</Text>}

      <Controller
        control={control}
        name="wardCode"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Ward Code"
            mode="outlined"
            value={value ?? ""}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="county"
        rules={{ required: "County is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="County *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            error={!!errors.county}
            style={styles.input}
          />
        )}
      />
      {errors.county && <Text style={styles.error}>{errors.county.message}</Text>}

      <Controller
        control={control}
        name="countyCode"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="County Code"
            mode="outlined"
            value={value?.toString()}
            onChangeText={(text) => onChange(text ? parseInt(text) : undefined)}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="subCounty"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Sub County"
            mode="outlined"
            value={value ?? ""}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="constituency"
        rules={{ required: "Constituency is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Constituency *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            error={!!errors.constituency}
            style={styles.input}
          />
        )}
      />
      {errors.constituency && <Text style={styles.error}>{errors.constituency.message}</Text>}

      <Controller
        control={control}
        name="constituencyCode"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Constituency Code"
            mode="outlined"
            value={value?.toString()}
            onChangeText={(text) => onChange(text ? parseInt(text) : undefined)}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />

      <Button
        loading={mutation.isPending}
        disabled={mutation.isPending}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}>
        Submit
      </Button>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  spacer: {
    width: 48,
  },
  description: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  input: {
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 32,
  },
});
