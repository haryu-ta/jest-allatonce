import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpenseSettlementPage from "./components/ExpenseSettlementPage/ExpenseSettlementPage";
import CreateGroupPage from "./components/CreateGroupPage/CreateGroupPage";

function App() {
  return (
    <>
      <ChakraProvider>
        <Container w="600px">
          <Router>
            <Routes>
              <Route path="/" element={<CreateGroupPage />} />
              <Route
                path="/group/:groupName"
                element={<ExpenseSettlementPage />}
              />
              <Route path="*" element={<>Not Found</>} />
            </Routes>
          </Router>
        </Container>
      </ChakraProvider>
    </>
  );
}

export default App;
