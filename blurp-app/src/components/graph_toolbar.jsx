import node_image from "../assets/node_image.svg";
import edge_image from "../assets/edge_image.svg";

function GraphToolbar () {
  return (
    <>
      <div className="h-full w-[40px] bg-gray-400 h-[420px] my-[90px] right-0 p-0 rounded-l-lg">
        <button>
          <img className="w-[35px] h-[35px]" src={node_image}></img>
        </button>
        <button>
          <img className="w-[35px] h-[35px]" src={edge_image}></img>
        </button>
      </div>
    </>
  );
}

export default GraphToolbar;