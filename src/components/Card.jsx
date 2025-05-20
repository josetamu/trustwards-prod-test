export const Card = ({ children }) => {
    return ( /* cada vez que se clickee en el div(cada cuadrado), ejecuta la función 'handleClick' */
      <div className='card'>
        {children}
      </div>
    )
  }