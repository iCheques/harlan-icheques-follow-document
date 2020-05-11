const Loading = (props) => {
  const style = {
    backgroundColor: '#fdad30',
    padding: '10px',
    color: '#fff',
    fontWeight: 'bold',
  };

  const parsed = $('<div>').css(style).append(`<span class="saving">${props.message}<span> .</span><span>.</span><span>.</span></span>`);
  return parsed;
};

export default Loading;
