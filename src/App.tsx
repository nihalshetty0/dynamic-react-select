import { useState } from "react";
import "./App.css";

import AsyncSelect from "react-select/async";
import { TRepository, TUser } from "./types";
import { GroupBase, OptionsOrGroups } from "react-select";

const repoSearchApiCall = (
  input: string,
  callback: (options: TRepository[]) => void
) => {
  return fetch(
    `https://api.github.com/search/repositories?per_page=10&page=2&q=${input}`
  )
    .then((res) => res.json())
    .then((data) => callback(data.items));
};

const userSearchApiCall = (
  input: string,
  callback: (options: TUser[]) => void
) => {
  //fetches something else
  return fetch(`https://api.github.com/search/users?q=${input}`)
    .then((res) => res.json())
    .then((data) => callback(data.items));
};

function App() {
  const [repo, setRepo] = useState<null | TRepository>(null);

  return (
    <div>
      <h4>Select a repositories</h4>
      <AsyncSelect
        value={repo}
        onChange={(newValue) => setRepo(newValue as TRepository | null)}
        loadOptions={debounceApiCall(repoSearchApiCall, 700)}
        getOptionLabel={(data) => (data as TRepository)?.full_name}
        getOptionValue={(data) => (data as TRepository)?.id.toString()}
        cacheOptions
        isClearable
        placeholder="Search repositories"
        // defaultOptions
      />
      <p>Selected repository: {repo?.full_name}</p>
      <div className="divider" />

      <h4>Select a user</h4>
      <AsyncSelect
        getOptionLabel={(data) => (data as TUser)?.login}
        getOptionValue={(data) => (data as TUser)?.id.toString()}
        loadOptions={debounceApiCall(userSearchApiCall, 700)}
        cacheOptions
        isClearable
        placeholder="Search user"
        // defaultOptions
      />
    </div>
  );
}

export default App;

const debounceApiCall = (
  func: (
    ...args: [
      string,
      (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
    ]
  ) => void,
  wait: number
) => {
  let timeout: ReturnType<typeof setInterval> | null;
  return function executedFunction(
    ...args: [
      string,
      (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
    ]
  ) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
