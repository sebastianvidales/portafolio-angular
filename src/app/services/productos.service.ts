import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

    cargando = true;
    productos: Producto [] = [];
    productosFiltrados: Producto [] = [];

  constructor( private http: HttpClient) {
    this.CargarProductos();
  }

  private CargarProductos(){

    return new Promise( (resolve, reject) => {
      this.http.get('https://angular-html-d5090.firebaseio.com/productos_idx.json')
      .subscribe( (resp: Producto[] ) => {
        this.productos = resp;
        setTimeout(() => {
          this.cargando = false;
          resolve();
        }, 2000);
      });
    });
  }
  getProducto(id: string){
        return this.http.get(`https://angular-html-d5090.firebaseio.com/productos/${id}.json`);
  }
  buscarProducto(termino: string){
    if(this.productos.length === 0){
    // tslint:disable-next-line: comment-format
    //cargar productos
    this.CargarProductos().then( () => {
      // tslint:disable-next-line: comment-format
      //ejecutar despues de tener los filtros
      // tslint:disable-next-line: comment-format
      //aplicar filtro
      this.filtrarProductos( termino );
    });
    } else {
      // tslint:disable-next-line: comment-format
      //aplicar el filtro
      this.filtrarProductos( termino );

    }
  }
  private filtrarProductos( termino: string){
    console.log(this.productos);
    /*lo unico que hacemos es cargar los datos que están en el arreglo
    producto, al arreglo productosFiltrados, pero con la diferencia de que solo tendremos 
    los datos buscados*/
    this.productosFiltrados = [];

    termino = termino.toLocaleLowerCase();  /*A la hora de ingresar la busqueda, se puede encontrar el 
    articulo sin importar las mayusculas o minusculas*/

    this.productos.forEach(prod => {

      const tituloLower = prod.titulo.toLocaleLowerCase(); /* se ingresa en una variable 
      constante y se aplica en la condición. Si la CATEGORIA tuviera minusculas y mayusculas, se aplica el mismo LocaleLowerCase */
      if (prod.categoria.indexOf ( termino ) >= 0 || tituloLower.indexOf ( termino ) >= 0) {
        this.productosFiltrados.push(prod);
      }
    });
    }
}

