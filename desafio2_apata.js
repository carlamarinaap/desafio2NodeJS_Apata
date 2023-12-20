const { get } = require('http');

const fs = require('fs').promises;
class ProductManager {
  constructor() {
    this.path = './productos.json',
    this.#id = 0
  }

  #id;

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

  getProductById = async(productId) =>  {
    let colectionJSON = await this.getProducts();
    let exists = colectionJSON.find((prod) => prod.id === productId)
    if (exists) {
      console.log(exists);
      return exists
    } else {
      console.log(`Not found id: ${productId}`);
      return `Not found id: ${productId}`
    }
  }
  updateProduct = async(productId, campo, valor) => {
    let colectionJSON = await this.getProducts();
    let exists = colectionJSON.find((prod) => prod.id === productId)
    if (exists) {
      exists[campo] = valor
      await this.deleteProduct(productId)
      await this.addProduct(exists)
    } else {
      console.log(`Not found id: ${productId}`);
      return `Not found id: ${productId}`
    }
  }

  deleteProduct = async (productId) => {
    let colectionJSON = await this.getProducts();
    let newArray = colectionJSON.filter((prod) => prod.id !== productId)
    await fs.writeFile(this.path, JSON.stringify(newArray))
    console.log(`Se eliminó el producto con id: ${productId}`);
  }


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
      let prodBuscado1 = await this.getProductById(1)
      let prodBuscado2 = await this.getProductById(5)
      console.log(prodBuscado1);
      console.log(prodBuscado2);

      await this.deleteProduct(0);
      prod = await instancia.getProducts();
      console.log(prod);

      await this.updateProduct(1,'title', 'Hola')
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