import React, { useState, useEffect } from "react";
import axios from "axios";
import LazyLoad from "react-lazyload";

import "./App.css";
import Spin from "./img/lazy-load-spinner.gif";

const Spinner = () => (
  <div className="loading">
    <h5>Loading.....</h5>
  </div>
);

const receiveData = async () => {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  const slicedData = res.data.slice(0, 10);
  return res;
};

const Post = ({ id, title, body }) => (
  <div className="post">
    <LazyLoad once={false} placeholder={<img src={Spin} alt="..." />}>
      <div className="post-img">
        <img src={`https://picsum.photos/id/${id}/200/200`} alt="..." />
      </div>
    </LazyLoad>
    <div className="post-body">
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  </div>
);

const App = () => {
  const [loadedData, setLoadedData] = useState(null);
  const ref = React.useRef(null);
  const store = React.useRef({ data: null, nextIndex: null });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    receiveData().then((res) => {
      store.current.data = res.data;
      setLoadedData(res.data.slice(0, 10));
      store.current.nextIndex = 10;
    });
  }, []);
  const onScroll = (e) => {
    const DOMRect = ref.current ? ref.current.getBoundingClientRect() : null;
    let bottom = DOMRect ? Math.abs(DOMRect.bottom) : null;
    console.log(DOMRect);
    console.log(window.scrollY);
    if (bottom && ref.current.scrollHeight - window.scrollY >= bottom) return;
    if (!store.current.data) return;
    if (store.current.nextIndex >= store.current.data.length) return;
    setLoadingMore(true);
    const morePosts = store.current.data.slice(0, store.current.nextIndex + 10);
    setTimeout(async () => {
      await setLoadedData(morePosts);
      await setLoadingMore(false);
      store.current.nextIndex += 10;
    }, 2000);
  };
  return (
    <div className="App" ref={ref}>
      <h2>LazyLoad Demo</h2>
      <div className="post-container"></div>
      <>
        {loadedData &&
          loadedData.map((post) => <Post key={post.id} {...post} />)}
        {loadingMore ? <Spinner /> : null}
      </>
    </div>
  );
};

export default App;
