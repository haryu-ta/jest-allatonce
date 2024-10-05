import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { expenseSchema } from "../../schema/expense";
import { Group } from "../../type";

export interface formInputs {
  expenseName: string;
  amount: number;
  payer: string;
}

interface CreateExpenseFormProps {
  group: Group;
  onSubmit: (data: formInputs) => Promise<void>;
}

const CreateExpenseForm: React.FC<CreateExpenseFormProps> = ({
  group,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<formInputs>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmitFrom = async (data: formInputs) => {
    const postData = {
      ...data,
      groupName: group.name,
    };

    try {
      await onSubmit(postData);
      console.info("登録成功");
      reset();
    } catch (e) {
      console.error(e);
      window.alert("登録に失敗");
    }
  };

  return (
    <VStack w={"full"} maxW={"600px"}>
      <form onSubmit={handleSubmit(onSubmitFrom)} style={{ width: "60%" }}>
        <VStack>
          <FormControl mb={5} isInvalid={Boolean(errors.expenseName)}>
            <FormLabel>支出名</FormLabel>
            <Input type="text" {...register("expenseName")} />
            <FormErrorMessage>
              {errors.expenseName && errors.expenseName.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mb={5} isInvalid={Boolean(errors.amount)}>
            <FormLabel>金額</FormLabel>
            <Input type="number" {...register("amount")} />
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>
          <FormControl mb={5} isInvalid={Boolean(errors.payer)}>
            <FormLabel>支払うメンバー</FormLabel>
            <Select placeholder="選択してください" {...register("payer")}>
              {group.members.map((member) => (
                <option value={member} key={member}>
                  {member}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.payer?.message}</FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="green"
            isLoading={isSubmitting}
            type="submit"
            w={"full"}
            m={5}
          >
            支出を登録
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};

export default CreateExpenseForm;
