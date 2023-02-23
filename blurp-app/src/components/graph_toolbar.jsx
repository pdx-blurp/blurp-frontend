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
      <div className="right-0 my-[90px] h-full h-[500px] w-[40px] justify-center rounded-l-lg border-[2px] border-gray-400 bg-gray-300 p-0">
        <button onClick={handleNodeSelection}>
          <img alt="Node tool" className="h-[40px] w-[40px]" src={node_image}></img>
        </button>
        <button onClick={handleEdgeSelection}>
          <img alt="Edge tool" className="h-[40px] w-[40px]" src={edge_image}></img>
        </button>
      </div>
    </>
  );
}

export default GraphToolbar;
