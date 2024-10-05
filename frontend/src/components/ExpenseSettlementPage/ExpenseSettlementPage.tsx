import { Group, Settlement } from "../../type";
import { useParams } from "react-router-dom";
import CreateExpenseForm, {
  formInputs,
} from "../CreateExpenseForm/CreateExpenseForm";
import SettlementList from "../SettlementList/SettlementList";
import { VStack } from "@chakra-ui/react";
import { useApi } from "../../hooks/useApi";

const ExpenseSettlementPage = () => {
  const { groupName } = useParams<{ groupName: string }>();
  const { data: group, error: groupError } = useApi<Group>(
    `${import.meta.env.VITE_API_BASE_URL}/groups/${groupName}`
  );
  const {
    data: settlements,
    error: settlementsError,
    refetch: refetchSettlements,
    postData: postExpense,
  } = useApi<Settlement[]>(
    `${import.meta.env.VITE_API_BASE_URL}/settlements/${groupName}`
  );

  const onSubmit = async (data: formInputs) => {
    try {
      await postExpense(data, `${import.meta.env.VITE_API_BASE_URL}/expenses/`);
      refetchSettlements();
    } catch (err) {
      console.error(err);
    }
  };

  if (!group || groupError || settlementsError) {
    return null;
  }

  return (
    <VStack m={6} w={"full"} maxW={"600px"} spacing={6}>
      <CreateExpenseForm group={group} onSubmit={onSubmit}></CreateExpenseForm>
      {settlements && (
        <SettlementList settlements={settlements}></SettlementList>
      )}
    </VStack>
  );
};

export default ExpenseSettlementPage;
