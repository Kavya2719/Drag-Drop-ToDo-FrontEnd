import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { motion } from "framer-motion";
import axios from "axios";

const ToDo = ({
  titleString,
  descriptionString,
  isCompleted = false,
  toDoID,
  tasksParentRef,
  x,
  y
}) => {
  const [over, setOver] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [title, setTitle] = useState(titleString);
  const [description, setDescription] = useState(descriptionString);
  const [isChecked, setIsChecked] = useState(isCompleted);

  const handleEditClick = () => {
    setIsActive(true);
  };

  const handleSaveClick = async () => {
    const toDo = {
      title: title,
      description: description,
      isDone: false,
    };

    try {
      await axios.post(`https://drag-drop-to-do-backend.vercel.app/update/${toDoID}`, toDo).then((res) => {
        const msg = res.data.message;
        console.log(msg);
        setIsActive(false);
      });
    } catch (error) {
      console.log(
        "Error while updating the todo into the database: ", error.message
      );
    }
  };

  const handleDeleteClick = async () => {
    try {
        await axios.post(`https://drag-drop-to-do-backend.vercel.app/delete/${toDoID}`).then((res) => {
          const msg = res.data.message;
          console.log(msg);
          setIsActive(false);
        });
      } catch (error) {
        console.log(
          "Error while deleting the todo from the database: ", error.message
        );
      }
  }

  const handleCheck = async () => {
    console.log(toDoID)
    try{
        await axios.post(`https://drag-drop-to-do-backend.vercel.app/${isActive? "markundone": "markdone"}/${toDoID}`)
                .then((res) => {
                    const msg = res.data.message;
                    console.log(msg);
                    setIsChecked(!isChecked);
                })
    } catch (error) {
        console.log("Error while updating the checkbox: ", error.message);
    }
  };

  const handleDrag = async (e, info) => {
    try {
        await axios.post(`https://drag-drop-to-do-backend.vercel.app/updatePosition/${toDoID}`, info.point)
            .then((res) => {
                const msg = res.data.message;
                console.log(msg, info.point.x, info.point.y);
            });
      } catch (error) {
            console.log(
                "Error while updating the position of todo into the database: ", error.message
            );
    }
  }

  console.log(x, y)

  return (
    <motion.div
      drag
      dragConstraints={tasksParentRef}
      onDragEnd={handleDrag}
      className="absolute p-5 flex-col flex w-[350px] shadow-md bg-emerald-200 rounded-md gap-2 hover:z-[1000] cursor-all-scroll"
      style={{ top: y, left: x }}
    >
      <div className="flex flex-row gap-3 items-center">
        <input
          type="checkbox"
          name="checkbox"
          checked={isChecked}
          onChange={handleCheck}
          className="w-[17px] h-[17px] cursor-pointer bg-emerald-100"
        />

        {isActive ? (
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="bg-transparent border-2 border-gray-300 rounded-md px-3 py-2 w-full"
          />
        ) : (
          <h1 className={`text-2xl ${isChecked && "line-through"}`}>{title}</h1>
        )}
      </div>

      <div className="flex flex-row gap-3 items-center">
        <button onClick={handleEditClick}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            color={over ? "black" : "gray"}
            onMouseOver={(e) => setOver(true)}
            onMouseLeave={(e) => setOver(false)}
          />
        </button>

        {isActive ? (
          <textArea
            type="text"
            name="description"
            placeholder="Description"
            className="bg-transparent border-2 border-gray-300 rounded-md px-3 py-2 w-full"
            onChange={(e) => setDescription(e.target.value)}
          >
            {description}
          </textArea>
        ) : (
          <h3 className={`text-lg ${isChecked && "line-through"}`}>
            {description}
          </h3>
        )}
      </div>

      {isActive && (
        <div className="flex-row flex justify-end">
            <button
                className="w-fit mx-auto bg-red-400 px-4 py-1 rounded-xl hover:shadow-lg transition-all duration-500 hover:scale-20 group flex relative overflow-hidden"
                onClick={handleDeleteClick}
            >
                Delete
                <div className="absolute top-0 -inset-1/2 h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
            </button>

            <button
                className="w-fit mx-auto bg-emerald-300 px-4 py-1 rounded-xl hover:shadow-lg transition-all duration-500 hover:scale-20 group flex relative overflow-hidden"
                onClick={handleSaveClick}
            >
                Save
                <div className="absolute top-0 -inset-1/2 h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
            </button>
        </div>
      )}
    </motion.div>
  );
};

export default ToDo;
