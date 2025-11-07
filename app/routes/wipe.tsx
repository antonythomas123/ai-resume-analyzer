import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async ({ file }: { file?: FSItem }) => {
    if (file) {
      await fs.delete(file.path);
    } else {
      //   files.forEach(async (file) => {
      //     await fs.delete(file.path);
      //   });
      Promise.all(files.map((file) => fs.delete(file.path)));
    }

    await kv.flush();
    await loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      Authenticated as: <span className="font-bold text-black text-[14px]">{auth.user?.username}</span>
      <div>Existing files: {files?.length}</div>
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex flex-row gap-4 items-center">
            <p>{file.name}</p>
            <img
              src="/icons/delete.svg"
              alt=""
              className="size-8 cursor-pointer"
              onClick={() => handleDelete({ file })}
            />
          </div>
        ))}
      </div>
      {files.length > 0 && (
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={() => handleDelete({})}
          >
            Wipe All App Data
          </button>
        </div>
      )}
    </div>
  );
};

export default WipeApp;
