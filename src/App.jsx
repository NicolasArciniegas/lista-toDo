import React, { useEffect, useRef, useState, useReducer } from "react";
import "./styles.css";
import { Button } from "react-bootstrap";

function TodoItem({ id, nombre, completado, dispatch }) {
  const iconos = {
    true: "↩️",
    false: "✅",
  };
  const eliminarItem = () => {
    dispatch({
      senal: "eliminar",
      id: id,
    });
  };
  const alternarItem = () => {
    dispatch({
      senal: "alternar",
      id: id,
    });
  };
  return (
    <div className="todoItem">
      <span>{nombre}</span>
      <div className="botoneraTodo">
        <Button onClick={() => alternarItem()}>
          {completado ? iconos[true] : iconos[false]}
        </Button>
        <Button onClick={() => eliminarItem()}>🗑</Button>
      </div>
    </div>
  );
}

function SinContenido({}) {
  return (
    <div className="sincontenido">
      <p>No hay items aun.</p>
    </div>
  );
}

// MAIN ----------------------------------

function Reducer(state, recibo) {
  switch (recibo.senal) {
    case "agregar":
      return {
        ...state,
        items: [...state.items, recibo.item],
        idCount: state.idCount + 1,
      };
    case "eliminar":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== recibo.id),
      };
    case "alternar":
      return {
        ...state,
        items: state.items.map((item) => {
          if (recibo.id === item.id) {
            return { ...item, completado: !item.completado };
          }
          return item;
        }),
      };
  }
}

export function App() {
  const input = useRef();
  const [{ items, idCount }, dispatch] = useReducer(Reducer, {
    items: [],
    idCount: 0,
  });

  const ordenarItems = () => {
    return items.sort((a, b) => {
      if (a.completado > b.completado) {
        return 1;
      } else if (a.completado < b.completado) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  return (
    <div className="main">
      <div className="titulo">
        <h4>Lista de Todos</h4>
      </div>
      <div>
        {items.length > 0 ? (
          ordenarItems().map((item) =>
            React.createElement(TodoItem, {
              ...item,
              dispatch: dispatch,
              key: item.id,
            })
          )
        ) : (
          <SinContenido />
        )}
      </div>
      <div className="botonera">
        <input
          ref={input}
          type="text"
          placeholder="Agregar nuevo toDo"
          size="40"
        />
        <Button
          variant="primary"
          onClick={() => {
            dispatch({
              senal: "agregar",
              item: {
                id: idCount,
                nombre: input.current.value,
                completado: false,
              },
            });
            input.current.value = "";
          }}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}
