import node_image from '../assets/node_image.svg';
import edge_image from '../assets/edge_image.svg';

function GraphToolbar({ handleIsNode }) {
  function handleNodeSelection() {
    handleIsNode(true);
  }

  function handleEdgeSelection() {
    handleIsNode(false);
  }

  return (
    <>
      <div className="h-full w-[40px] bg-gray-300 border-[2px] border-gray-400 h-[500px] my-[90px] right-0 p-0 rounded-l-lg justify-center">
        <button onClick={handleNodeSelection}>
          <img className="w-[40px] h-[40px]" src={node_image}></img>
        </button>
        <button onClick={handleEdgeSelection}>
          <img className="w-[40px] h-[40px]" src={edge_image}></img>
        </button>
      </div>
    </>
  );
}

export default GraphToolbar;
