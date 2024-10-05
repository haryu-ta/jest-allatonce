import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { groupSchema } from "../../schema/group";

// フォームで使用する変数の型を定義
export interface formInputs {
  name: string;
  members: string;
}

interface CreateGroupFormProps {
  onSubmit: (data: formInputs) => Promise<void>;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onSubmit }) => {
  // React Hook Formでバリデーションやフォームが送信されたときの処理などを書くために必要な
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<formInputs>({
    resolver: zodResolver(groupSchema),
  });

  // フォームが送信されたときの処理
  const onSubmitForm = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      console.info("登録成功");
      reset();
    } catch (e) {
      console.error(e);
      window.alert("登録に失敗");
    }
  });

  return (
    <VStack maxW={"600px"}>
      <form onSubmit={onSubmitForm} style={{ width: "60%" }}>
        {/* 名前 */}
        <FormControl mb={5} isInvalid={Boolean(errors.name)}>
          <FormLabel htmlFor="name">グループ名</FormLabel>
          <Input id="name" placeholder="旅行" {...register("name")} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        {/* メールアドレス */}
        <FormControl mb={10} isInvalid={Boolean(errors.members)}>
          <FormLabel htmlFor="members">メンバー</FormLabel>
          <Input
            id="members"
            placeholder="太郎, 花子"
            {...register("members")}
          />
          <FormErrorMessage>
            {errors.members && errors.members.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="green"
          isLoading={isSubmitting}
          type="submit"
          w={"full"}
        >
          グループを作成
        </Button>
      </form>
    </VStack>
  );
};

export default CreateGroupForm;
