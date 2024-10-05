import {
  UnorderedList,
  ListItem,
  Text,
  VStack,
  HStack,
  Box,
} from "@chakra-ui/react";
import { Settlement } from "../../type";

interface SettlementListProps {
  settlements: Settlement[];
}

const SettlementList: React.FC<SettlementListProps> = ({ settlements }) => {
  return (
    <VStack align={"start"} w={"60%"} maxW={"600px"}>
      <Text borderBottom={"1px"}>清算方法</Text>
      <UnorderedList spacing={"2"}>
        {settlements.map((split, index) => (
          <ListItem key={index} w={"300px"}>
            <HStack justifyContent={"space-between"} w={"full"}>
              <Box>
                {split.from} → {split.to}
              </Box>
              <Box>{split.amount}円</Box>
            </HStack>
          </ListItem>
        ))}
      </UnorderedList>
    </VStack>
  );
};

export default SettlementList;
