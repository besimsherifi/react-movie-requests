import React, {useState, useEffect, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 


  // function fetchMovies() {
  //   fetch('https://swapi.dev/api/films').then(res => {
  //     return res.json();
  //   }).then(data => {
  //     const mapedMovies = data.results.map(movie => {
  //       return {
  //         id: movie.episode_id,
  //         title: movie.title,
  //         openingText: movie.opening_crawl,
  //         releaseDate: movie.release_date
  //       }
  //     });
  //     setMovies(mapedMovies);
  //   });
  // }

  const fetchMovies = useCallback(async () => {         //kjo shkon me async await funksioni i njejt si aj nalt
    setIsLoading(true);
    setError(null);
    try{
      const response = await fetch('https://react-http-c8db8-default-rtdb.europe-west1.firebasedatabase.app/movies.json');
      
      if (!response.ok){
        throw new Error('Something went wrong');
      }
      const data = await response.json();

      const loadedMovies = []; 

      for (const key in data){
        loadedMovies.push({
          id:key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }
      setMovies(loadedMovies);
      setIsLoading(false);
    }catch (error){
      setError(error.message)
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies])
  

 async function addMovieHandler(movie) {
     const response = await fetch('https://react-http-c8db8-default-rtdb.europe-west1.firebasedatabase.app/movies.json', {
      method:'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }


  let content = <p> </p>

  if(movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if(error){
    content = <p>{error}</p>;
  }

  if(isLoading){
    content = <p>Loading...</p>
  }

  if(movies.length === 0 && !error){
    content = <p>Found no movies.</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>   {/* dmth kjo posht osht optimizau */}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>} */}  
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
