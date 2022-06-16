import React, { Component } from 'react'
import Tour from 'reactour'
const steps = [
    {
      selector: '.first-step',
      content: 'This is my first Step',
    },
    // ...
  ]
export default class HomeTour extends Component {
    state = {
        isTourOpen: false,
        isShowingMore: false
      };
      closeTour = () => {
        this.setState({ isTourOpen: false });
      };
      openTour = () => {
        this.setState({ isTourOpen: true });
      };
    render() {
        return (
            <div>
                {/* <Demo */}
        {/* //   toggleShowMore={this.toggleShowMore} */}
        {/* //   isShowingMore={isShowingMore} */}
        {/* /> */}
                <Tour
        steps={steps}
        openTour={this.state.openTour}

        isOpen={this.state.isTourOpen}
        onRequestClose={this.closeTour} />
            </div>
        )
    }
}
