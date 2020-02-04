const { db } = require("./database");

const pizzaResolver = {
  Query: {
    clientes() {
      return executeQuery("select * from Clientes");
    },
    productos(){
      return executeQuery(`select * from  "Productos"`);

    }
 
 
  },
  Pizza: {
    ingredients(pizzaParam) {
      const query = `SELECT ingredient.* FROM  pizza, pizza_ingredients, ingredient
          WHERE pizza.id=pizza_ingredients.pizza_id and pizza_ingredients.ingredient_id = ingredient.id
            and pizza_ingredients.pizza_id =$1;`;
      return executeQuery(query, pizzaParam.id);
    }
  },

  Mutation: {
    async createCliente(root, { cliente }) {
      if (cliente === undefined) return null;
      const query = `INSERT INTO public."Clientes"(ci, nombre, correo) VALUES ($1,$2,$3) returning *;`;
      let res = await db.one(query, [cliente.ci,cliente.nombre, cliente.correo]);

      // INSERTAR  Detalle  de ingredientes
      if (res.id && pizza.ingredientIds && pizza.ingredientIds.length > 0) {
        pizza.ingredientIds.forEach(IngredientId => {
          const query = `INSERT INTO pizza_ingredients(pizza_id, ingredient_id)
                              VALUES ($1, $2)`;

          executeQuery(query, [res.id, IngredientId]);
        });
      }
      return res;
    },
    // ACTUALIZAR PIZZA
    async updatePizza(root, { pizza }) {
      if (pizza === undefined) return null;
      const query =
        "UPDATE  pizza SET name=$2, origin=$3  WHERE  id=$1 returning * ";
      let res = await db.one(query, [pizza.id, pizza.name, pizza.origin]);

      executeQuery("DELETE FROM  pizza_ingredients WHERE pizza_id=$1; ", [
        pizza.id
      ]);

      // update detalle
      if (res.id && pizza.ingredientIds && pizza.ingredientIds.length > 0) {
        pizza.ingredientIds.forEach(IngredientId => {
          const query = `INSERT INTO pizza_ingredients(pizza_id, ingredient_id)
                              VALUES ($1, $2)`;

          executeQuery(query, [res.id, IngredientId]);
        });
      }

      return res;
    },

    // ELIMINAR PIZZA
    async deletePizza(root, { pizza }) {
      if (pizza === undefined) return null;

      executeQuery("DELETE FROM  pizza_ingredients WHERE pizza_id=$1; ", [
        pizza.id
      ]);
      const query = "DELETE  FROM pizza  WHERE id=$1 returning * ";
      let res = await db.one(query, [pizza.id]);
      return res;
    }
  }
};

async function executeQuery(query, parameters) {
  let recordset = await db
    .any(query, parameters)
    .then(res => res)
    .then(err => err);
  return recordset;
}

export default pizzaResolver;
