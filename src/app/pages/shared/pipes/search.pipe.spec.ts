import { SearchPipe } from './search.pipe';
import { serialize } from 'v8';

describe('SearchPipe', () => {
  const pipe = new SearchPipe();
  let searchText = 'Adobe';
  let app = [
      { name: 'Adobe'},
      { name: 'Saba'},
      { name: 'Sales Force'},
      { name: 'Workday'}
    ];
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('filter pipe should be instanciated', () => {
    expect(SearchPipe).toBeDefined();
  });

  it('should search from given search string', () => {
    searchText = 'Adobe';
    app = [
      { name: 'Adobe'},
      { name: 'Saba'},
      { name: 'Sales Force'},
      { name: 'Workday'}
    ];
    expect(pipe.transform(app, searchText)).toEqual([{name: 'Adobe'}]);
    expect(pipe.transform(app, searchText).length).toEqual(1);
  });

  it('should search with blank string', () => {
    searchText = '';
    expect(pipe.transform(app, searchText)).toEqual(app);
  });

  it('should search with differnt string', () => {
    searchText = 'pooja';
    expect(pipe.transform(app, searchText)).toEqual([]);
  });

  it('should check length with some characters', () => {
    searchText = 'Sa';
    expect(pipe.transform(app, searchText).length).toEqual(2);

    searchText = 'workday';
    expect(pipe.transform(app, searchText).length).toEqual(1);

    app = [];
    expect(pipe.transform(app, searchText)).toEqual([]);
  });

});
