"use client";
import React from "react";

// icons
import { Pencil, Trash } from "lucide-react";

// components
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

// modal
import { useModal } from "@/hooks/use-modal-store";

const Page = () => {
  const { onOpen } = useModal();

  return (
    <div className="mx-auto px-2 md:px-0 md:max-w-3xl">
      <div className="flex items-start justify-between mb-2">
        <div className="">
          <h3 className="text-2xl mb-1 font-poppins">Note title</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 dark:text-gray-400 text-sm">tag</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Created at:{" "}
            </p>
          </div>
        </div>
        {/* actions */}

        <div className="flex items-center gap-x-2">
          <Actiontooltip align="center" label="Edit note" side="bottom">
            <button
              onClick={() => onOpen("EditNote")}
              className="p-1 transition-colors duration-75 group"
            >
              <Pencil
                size={16}
                className="text-gray-200 group-hover:text-indigo-500 transition-colors duration-75"
              />
            </button>
          </Actiontooltip>
          <Actiontooltip align="center" label="Delete note" side="bottom">
            <button
              onClick={() => onOpen("DeleteNote")}
              className="p-1  transition-colors duration-75 group"
            >
              <Trash
                size={16}
                className="text-gray-200 group-hover:text-rose-500 transition-colors duration-75"
              />
            </button>
          </Actiontooltip>
        </div>
      </div>
      <div className="">
        <p className="text-sm mb-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt odit
          pariatur quam debitis vitae nostrum voluptate, velit, eius
          reprehenderit harum error saepe inventore aliquam blanditiis. Saepe
          aliquam ipsa dolorem consequatur alias! Fuga sunt delectus dicta
          minima incidunt, eos debitis magnam, assumenda quia laborum placeat
          dolorem ipsa aut corrupti. Doloribus sequi fugit iste aut itaque,
          pariatur ducimus sunt unde eum suscipit eligendi commodi dolorem,
          aperiam sit illum deserunt exercitationem minima molestiae officiis
          sed? Consequuntur eius aperiam commodi ipsa iusto unde est magnam
          soluta fuga odit sed velit natus deleniti recusandae aliquid
          laudantium, atque reprehenderit labore eveniet totam obcaecati nulla
          sit eaque.
        </p>
      </div>
    </div>
  );
};

export default Page;
