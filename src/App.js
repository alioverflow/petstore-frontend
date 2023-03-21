import PetsByTags from './PetsByTags';

function App() {
  return (
    <>
      <header>
        Petstore-Frontend — UI for Swagger Petstore v3 API
        <br />
        <a href={'https://petstore3.swagger.io/'}>https://petstore3.swagger.io/</a>
      </header>
      <hr />
      <main>
        <PetsByTags />
      </main>
    </>
  );
}

export default App;
