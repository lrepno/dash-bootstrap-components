// For docs:  How to style the next/prev icons:  https://github.com/reactstrap/reactstrap/issues/1367
//              ? https://github.com/reactstrap/reactstrap/issues/1965
//            To center an image that's smaller than the rest of the slides, use text-align center on the carousel wrapper
//            Note defaults - interval = 5000
//            Header and captions don't show on the smallest screen
//            Include nice photos for the docs?
//
// questions/notes
//    ? Should `height` and `width` props be added for the image?
//    ? Is there a way to add Markdown text to the slides?  How about other components?
//    -  Review my javascript for anti patterns
//    - odd behaviour when trying to use interval to pause.  It will stop when interval=false in callback, but when
//          set to interval=2000, it doesn't restart.  Workaound is to control it with dcc.Interval and active_index prop
//

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {omit} from 'ramda';

import {
  Carousel as RSCarousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

/**
 * Component for creating Bootstrap carousel.  This component is a slideshow
 * for cycling through a series of content.
 */
const Carousel = props => {
  const [animating, setAnimating] = useState(false);
  const {
    items,
    active_index,
    style,
    className,
    src_className,
    src_style,
    caption_className,
    caption_style,
    loading_state,
    controls,
    indicators,
    setProps,
    ...otherProps
  } = props;

  const next = () => {
    if (animating) return;
    const nextIndex = active_index === items.length - 1 ? 0 : active_index + 1;
    setProps({active_index: nextIndex});
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = active_index === 0 ? items.length - 1 : active_index - 1;
    setProps({active_index: nextIndex});
  };

  const goToIndex = newIndex => {
    if (animating) return;
    setProps({active_index: newIndex});
  };

  const slides = items.map(item => {
    // note - the default 'd-block w-100' is from the examples in the Bootstrap docs.
    item.src_className =
      typeof item.src_className !== 'undefined'
        ? item.src_className
        : 'd-block w-100';

    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.id}
      >
        <img
          src={item.src}
          className={item.src_className}
          style={item.src_style}
          alt={item.altText}
        />

        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.header}
          className={item.caption_className}
          style={item.caption_style}
        />
      </CarouselItem>
    );
  });

  const showControls = () => {
    if (controls) {
      return (
        <React.Fragment>
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
        </React.Fragment>
      );
    }
  };

  const showIndicators = () => {
    if (indicators) {
      return (
        <CarouselIndicators
          items={items}
          activeIndex={active_index}
          onClickHandler={goToIndex}
        />
      );
    }
  };

  return (
    <div style={style} className={className}>
      <RSCarousel
        data-dash-is-loading={
          (loading_state && loading_state.is_loading) || undefined
        }
        activeIndex={active_index}
        next={next}
        previous={previous}
        {...omit(['setProps'], otherProps)}
      >
        {showIndicators()}
        {slides}
        {showControls()}
      </RSCarousel>
    </div>
  );
};

Carousel.defaultProps = {
  active_index: 0,
  controls: true,
  indicators: true
};

Carousel.propTypes = {
  /**
   * The ID of the component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * Defines CSS styles of the carousel container. Will override styles previously set.
   */
  style: PropTypes.object,

  /**
   * Defines the className of the carousel container.  This is often used with CSS to style elements with common properties.
   */
  className: PropTypes.string,

  /**
   * The items to display on the slides in the carousel
   */
  items: PropTypes.arrayOf(
    PropTypes.exact({
      /**
       * The id of the item
       */
      id: PropTypes.string,
      /**
       * The URL of the image
       */
      src: PropTypes.string,
      /**
       * The alternate text for an image, if the image cannot be displayed
       */
      alt: PropTypes.string,
      /**
       * The className for the image.  The default is 'd-block w-100'
       */
      src_className: PropTypes.string,
      /**
       * The style for the image
       */
      src_style: PropTypes.string,
      /**
       * The Header for the caption of item. The text is displayed in a <h5> element
       */
      header: PropTypes.string,
      /**
       * The caption of the item.  The text is displayed in a <p> element
       */
      caption: PropTypes.string,
      /**
       * The className for the header and caption container
       */
      caption_className: PropTypes.string,
      /**
       * The style for the header and caption container
       */
      caption_style: PropTypes.string
    }).isRequired
  ),

  /**
   * The current visible slide number
   */
  active_index: PropTypes.number,

  /**
   * Show the Carousel previous and next arrows for changing the current slide
   */
  controls: PropTypes.bool,

  /**
   * Show a set of slide position indicators
   */
  indicators: PropTypes.bool,

  /**
   * Autoplays the carousel after the user manually cycles the first item. If "carousel", autoplays the carousel on load.
   * This is how bootstrap defines it... I would prefer a bool named autoplay or something...
   */
  ride: PropTypes.oneOf(['carousel']),

  /**
   * controls whether the slide animation on the Carousel works or not
   */
  slide: PropTypes.bool,

  /**
   *the interval at which the carousel automatically cycles (default: 5000)
   * If set to false, carousel will not Autoplay (i.e. will not automatically cycle).
   */
  interval: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool
  ]),

  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state: PropTypes.shape({
    /**
     * Determines if the component is loading or not
     */
    is_loading: PropTypes.bool,
    /**
     * Holds which property is loading
     */
    prop_name: PropTypes.string,
    /**
     * Holds the name of the component that is loading
     */
    component_name: PropTypes.string
  }),

  /**
   * Dash-assigned callback that gets fired when the value changes.
   */
  setProps: PropTypes.func
};

export default Carousel;
