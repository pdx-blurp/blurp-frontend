
// function DataSidebar({expanded}) {
//     if(expanded=="true")
//         return (
//             <>
//                 <div class="absolute w-[260px] h-[60%] my-[100px] right-0 p-0">
//                     <div class="relative flex w-full h-full p-0 mr-0">
//                         <div class="absolute flex w-[15px] h-[60px] mt-[50px] bg-gray-400 rounded-l-md hover:cursor-pointer items-center">
//                             <svg class="h-full w-full text-gray-200 dark:text-gray-200" fill="currentColor"><polygon points="5,20 5,40 14,30"/></svg>
//                         </div>
//                         <div class="absolute flex w-[245px] p-0 mr-0 ml-[15px] bg-gray-200 h-full border-2 border-gray-400 rounded-l-xl">
//                             <p>This is a data sidebar. The data of the selected entity in the graph will appear here.</p>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     else if(expanded=="false")
//         return (
//             <>
//                 <div class="absolute w-[15px] h-[60%] my-[100px] right-0 p-0">
//                     <div class="relative flex w-full h-full p-0 mr-0">
//                         <div class="absolute flex w-[15px] h-[60px] mt-[50px] bg-gray-400 rounded-l-md hover:cursor-pointer items-center">
//                             <svg class="h-full w-full text-gray-200 dark:text-gray-200" fill="currentColor"><polygon points="12,20 12,40 3,30"/></svg>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
// }

import React from 'react';

class DataSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            main_div_width: "absolute w-[260px] h-[60%] my-[100px] right-0 p-0",
            tab_svg_coords: "5,20 5,40 14,30",
            sidebar_visibility: "absolute flex w-[245px] p-0 mr-0 ml-[15px] bg-gray-200 h-full border-2 border-gray-400 rounded-l-xl",
            content: this.renderContent()
        }
        this.collapse = this.collapse.bind(this);
    }

    collapse = () => {
        this.setState({
            main_div_width: "absolute w-[15px] h-[60%] my-[100px] right-0 p-0",
            tab_svg_coords: "12,20 12,40 3,30",
            sidebar_visibility: "invisible",
            content: (
                <div class="absolute w-[15px] h-[60%] my-[100px] right-0 p-0">
                    <div class="relative flex w-full h-full p-0 mr-0">
                        <div class="absolute flex w-[15px] h-[60px] mt-[50px] bg-gray-400 rounded-l-md hover:cursor-pointer items-center" onClick={this.expand}>
                            <svg class="h-full w-full text-gray-200 dark:text-gray-200" fill="currentColor"><polygon points="12,20 12,40 3,30"/></svg>
                        </div>
                        <div class="absolute flex w-[245px] p-0 mr-0 ml-[15px] bg-gray-200 h-full border-2 border-gray-400 rounded-l-xl invisible">
                            <p>This is a data sidebar. The data of the selected entity in the graph will appear here.</p>
                        </div>
                    </div>
                </div>
            )
        })
    }

    expand = () => {
        this.setState({
            content: (
                <div class="absolute w-[260px] h-[60%] my-[100px] right-0 p-0">
                    <div class="relative flex w-full h-full p-0 mr-0">
                        <div class="absolute flex w-[15px] h-[60px] mt-[50px] bg-gray-400 rounded-l-md hover:cursor-pointer items-center" onClick={this.collapse}>
                            <svg class="h-full w-full text-gray-200 dark:text-gray-200" fill="currentColor"><polygon points="5,20 5,40 14,30"/></svg>
                        </div>
                        <div class="absolute flex w-[245px] p-0 mr-0 ml-[15px] bg-gray-200 h-full border-2 border-gray-400 rounded-l-xl">
                            <p>This is a data sidebar. The data of the selected entity in the graph will appear here.</p>
                        </div>
                    </div>
                </div>
            )
        });
    }

    renderContent() {
        return (
            <div class="absolute w-[260px] h-[60%] my-[100px] right-0 p-0">
                    <div class="relative flex w-full h-full p-0 mr-0">
                        <div class="absolute flex w-[15px] h-[60px] mt-[50px] bg-gray-400 rounded-l-md hover:cursor-pointer items-center" onClick={this.collapse}>
                            <svg class="h-full w-full text-gray-200 dark:text-gray-200" fill="currentColor"><polygon points="5,20 5,40 14,30"/></svg>
                        </div>
                        <div class="absolute flex w-[245px] p-0 mr-0 ml-[15px] bg-gray-200 h-full border-2 border-gray-400 rounded-l-xl">
                            <p>This is a data sidebar. The data of the selected entity in the graph will appear here.</p>
                        </div>
                    </div>
                </div>
        );
    }

    render() {
        return (
            <>
                {this.state.content}
            </>
        );
    }
}

export default DataSidebar;