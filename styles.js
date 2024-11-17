import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue', 
    padding: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue', 
    textAlign:'center',
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white', 
    borderRadius: 8,
    padding: 10,
  },
  mapView: {
    flex: 1,
    borderRadius: 15, 
    borderColor: '#DAB785', 
    borderWidth: 1,
    overflow: 'hidden',
  },
  errorText: {
    fontSize: 16,
    color: '#D9534F', 
    marginBottom: 10,
    textAlign: 'center',
  },
});


