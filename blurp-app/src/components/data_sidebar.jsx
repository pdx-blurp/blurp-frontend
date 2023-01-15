import React from 'react';

class DataSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.data_sidebar = "data-sidebar";
        this.svg_coods = "5,20 5,40 14,30";
        this.data_sidebar_background = "data-sidebar-background";
        this.onclick = this.collapse;
        this.state = ({
            content: this.renderContent()
        });
        this.expand = this.expand.bind();
        this.collapse = this.collapse.bind(this);
    }

    collapse = () => {
        this.data_sidebar = "data-sidebar w-[15px]";
        this.svg_coods = "12,20 12,40 3,30";
        this.data_sidebar_background = "invisible";
        this.onclick = this.expand;
        this.setState({
            content: this.renderContent()
        })
    }

    expand = () => {
        this.data_sidebar = "data-sidebar";
        this.svg_coods = "5,20 5,40 14,30";
        this.data_sidebar_background = "data-sidebar-background";
        this.onclick = this.collapse;
        this.setState({
            content: this.renderContent()
        });
    }

    renderContent() {
        return (
            <>
                <div class={this.data_sidebar}>
                    <div class="data-sidebar-tab" onClick={this.onclick}>
                        <svg class="data-sidebar-tab-arrow" fill="currentColor">
                            <polygon points={this.svg_coods}/>
                        </svg>
                    </div>
                    <div class={this.data_sidebar_background}>
                        <p>
                            This is a data sidebar. The data of the selected
                            entity in the graph will appear here.
                        </p>
                    </div>
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