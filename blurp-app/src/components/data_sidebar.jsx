import React from 'react';

class DataSidebar extends React.Component {
    constructor(props) {
        super(props);

        // Each of the four specifications below is an array: [collapsed, expanded].
        // The first element is what the specification is when the data-sidebar is collapsed,
        // and the second element is when it's expanded.
        //
        // className for the main sidebar div
        this.data_sidebar = ["data-sidebar w-[15px]", "data-sidebar"];
        // svg coordinates for the collapse/expand arrow on the tab/button
        this.svg_coods = ["12,20 12,40 3,30", "4,20 4,40 13,30"];
        // Function to be called when the tab/button is clicked
        this.onclick = [this.expand, this.collapse];
        // The content to appear inside the collapsable div
        this.inside_content =
        [
            <></>,
            <div className="data-sidebar-background">
                <p>
                    This is a data sidebar. The data of the selected
                    entity in the graph will appear here.
                </p>
            </div>
        ];

        this.state = ({
            content: this.renderContent(1)
        });
        this.expand = this.expand.bind();
        this.collapse = this.collapse.bind(this);
    }

    collapse = () => {
        this.setState({
            content: this.renderContent(0)
        });
    }

    expand = () => {
        this.setState({
            content: this.renderContent(1)
        });
    }

    // Generates code for the div. Takes an argument: 0 if collapsed, 1 if expanded
    renderContent(expanded=1) {
        return (
            <>
                <div className={this.data_sidebar[expanded]}>
                    <div className="data-sidebar-tab" onClick={this.onclick[expanded]}>
                        <svg className="data-sidebar-tab-arrow" fill="currentColor">
                            <polygon points={this.svg_coods[expanded]}/>
                        </svg>
                    </div>
                    {this.inside_content[expanded]}
                </div>
            </>
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