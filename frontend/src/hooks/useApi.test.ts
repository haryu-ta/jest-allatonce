import { renderHook, waitFor, act } from "@testing-library/react";
import { useApi } from "./useApi";
import axios from "axios";

jest.mock("axios");

type Mizu = {
  name: string;
  tesm: string;
};

describe("all test", () => {
  describe("fetchDataのテスト", () => {
    test("正常系", () => {
      const reposnseData: Mizu = {
        name: "Mizuhara",
        tesm: "Pirates",
      };
      const mockAxios = jest.mocked(axios);
      mockAxios.get.mockResolvedValue({ data: reposnseData });
      const { result } = renderHook(() => useApi("/get"));
      waitFor(() => {
        expect(result.current.data).toEqual({ data: reposnseData });
      });
    });

    test("異常系", async () => {
      const mockAxios = jest.mocked(axios);
      mockAxios.get.mockRejectedValue(() => {
        throw new Error();
      });
      const { result } = renderHook(() => useApi("/get"));
      waitFor(() => {
        expect(result.current.error).toBe("エラーが発生しました");
      });
    });
  });

  describe("postDataのテスト", () => {
    test("正常系", async () => {
      const mockAxios = jest.mocked(axios);
      mockAxios.mockResolvedValue({ data: { message: "OK" } });
      const { result } = renderHook(() => useApi("/url"));
      let response;
      await act(async () => {
        response = await result.current.postData({ name: "Mizuhara" }, "/post");
      });
      expect(mockAxios).toHaveBeenCalledTimes(1);
      expect(mockAxios).toHaveBeenCalledWith({
        url: "/post",
        method: "post",
        data: { name: "Mizuhara" },
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(response!.data).toEqual({ message: "OK" });
      mockAxios.mockClear();
    });

    test("異常系のテスト", async () => {
      const mockAxios = jest.mocked(axios);
      mockAxios.mockRejectedValue(() => {
        throw new Error();
      });
      const { result } = renderHook(() => useApi("/url"));
      let response;
      await act(async () => {
        response = await result.current.postData(
          { name: "Mizukara" },
          "/posts"
        );
      });
      waitFor(() => {
        expect(response!.error).toEqual("エラーが発生しました");
      });
      expect(mockAxios).toHaveBeenCalledTimes(1);
      expect(mockAxios).toHaveBeenCalledWith({
        url: "/posts",
        method: "post",
        data: { name: "Mizukara" },
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });
});
