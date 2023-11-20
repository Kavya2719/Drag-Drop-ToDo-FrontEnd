import { ToDo } from "./Components";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const tasksParentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [toDos, setToDos] = useState([]);

  const handleAddToDo = async () => {
    if (isLoading) return;
    const toDo = {
      title: title,
      description: description,
      isDone: false,
      x: 32,
      y: 110
    };

    setIsLoading(true);
    try {
      await axios.post("https://drag-drop-to-do-backend.vercel.app/addToDo", toDo).then((res) => {
        const msg = res.data.message;
        console.log(msg);
      });

      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(
        "Error while adding the todo into the database: ", error.message
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        await axios.get("https://drag-drop-to-do-backend.vercel.app/showAllToDos").then((res) => {
          const msg = res.data.message,
            allToDos = res.data.allToDos;
          console.log(msg);
          setToDos(allToDos);
        });
      } catch (error) {
        console.log(
          "Error while fetching the todos from the database: ",
          error.message
        );
      }
    };

    fetchToDos();
  }, []);


  return (
    <>
      <h1 className="w-full text-center py-5 text-2xl shadow-md">
        ToDo CheckList Dashboard
      </h1>

      <div className="w-full flex flex-row py-5 gap-5 pl-5 pr-3 rounded-xl">
        <div
          ref={tasksParentRef}
          className="mr-auto p-3 shadow-xl rounded-xl w-full h-[720px]"
        >
          {toDos.map(({ title, description, isDone, _id, x, y }, index) => {
            return (
              <ToDo
                key={index}
                toDoID={_id}
                titleString={title}
                descriptionString={description}
                isCompleted={isDone}
                tasksParentRef={tasksParentRef}
                x={x}
                y={y}
              />
            )
          })}
        </div>

        <div className="my-16 flex flex-col px-5 py-10 gap-5 shadow-xl w-fit h-fit rounded-xl">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-3 py-2"
          />

          <textarea
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-3 py-2 h-[200px] overflow-auto"
          />

          <button
            className="w-fit mx-auto bg-emerald-300 px-4 py-1 rounded-xl hover:shadow-lg transition-all duration-500 hover:scale-20 group flex relative"
            onClick={handleAddToDo}
          >
            Add Task
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
