import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'oPLzA0tjcvVPFtOianuHHGnfbbLKonwD';
  private _historial: string[] = [];

  //TODO: Cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial].splice(0,10)
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultimoResultado')!) || [];
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  buscarGifs(query: string){

    query = query.trim().toLowerCase();

    if(query.trim().length === 0){
      return;
    }

    this._historial= this._historial.filter(x => x !== query)
    this._historial.unshift(query);
    localStorage.setItem('historial', JSON.stringify(this._historial));

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', 10)
          .set('q', query);
    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, {params})
        .subscribe((resp) => {
          this.resultados = resp.data;
          localStorage.setItem('ultimoResultado', JSON.stringify(this.resultados));
        });


    // if(this._historial.length > 10){
    //   this._historial.pop()
    // }
  }
}
