import { createContext, useState } from "react";

export const FileContext = createContext<FileType>({
  file: {} as File,
  setFile: (file: File) => {},
});

const FileProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [file, setFile] = useState({} as File);

  return (
    <FileContext.Provider
      value={{
        file,
        setFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileProvider;
