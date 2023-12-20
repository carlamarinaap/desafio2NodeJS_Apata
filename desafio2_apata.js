
const fs = require('fs').promises;
class ProductManager {
  constructor() {
    this.path = './productos.json',
    this.#id = 0
  }

  #id;

  // async validationProductId(productId){
  //   let objectColection = await this.getProducts();
  //   const newArray = objectColection.filter(product => productId === product.id);
  //   if (newArray.length === 0) {
  //     throw new Error(`Id nro ${productId}: Not Found`);
  //   } 
  //   return newArray[0]
  // }

  getProducts = async () =>  {
    try {
      let colectionJSON = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(colectionJSON)
    } 
    catch (error) {
      await fs.writeFile(this.path, '[]');
      let colectionJSON = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(colectionJSON)
    }
  }

  addProduct = async (product) => {
    let {title, description, price, thumbnail, code, stock} = product
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error(`El producto debe tener todos los campos completos`);
    }
    let colectionJSON = await this.getProducts();
    let exists = colectionJSON.some((prod) => prod.code === code)
    if (exists) {
      console.log(`Ya existe un producto con el código ${code}`);
      return
    }
    product.id = this.#id;
    colectionJSON.push({...product})
    await fs.writeFile(this.path, JSON.stringify(colectionJSON))
    console.log(`Se agregó el producto "${product.title}" a la colección`);
    this.#id = this.#id + 1
  }

  getProductById = (productId) =>  {}
  updateProduct = (productId, campo) => {}
  deleteProduct = (productId) => {}  

  test =  async () => {
    console.log("Productos actuales:");
    let prod = await instancia.getProducts();
    console.log(prod);
  
    try {
      await instancia.addProduct({
        title: 'producto prueba1',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
      });
      await instancia.addProduct({
        title: 'producto prueba2',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'def1234',
        stock: 25
      });
      await instancia.addProduct({
        title: 'producto prueba1',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
      });
      await instancia.addProduct({
        title: 'producto prueba3',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'ghi789',
        stock: 25
      });
  
      console.log("Productos después de agregar:");
      prod = await instancia.getProducts();
      console.log(prod);
    } catch (error) {
      console.error(error);
    }
  }
}

// Testing:


const instancia = new ProductManager();

instancia.test()