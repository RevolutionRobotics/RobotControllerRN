import { StyleSheet } from 'react-native';
import { defaultValues } from 'components/appStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: defaultValues.appBackground
  },
  card: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 180,
    backgroundColor: defaultValues.appBackground,
    padding: 0,
    marginHorizontal: 20
  },
  cardContent: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardLabel: {
    width: '100%',
    color: 'white',
    fontFamily: 'jura',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center'
  },
  cardBackground: {
    width: '100%',
    height: '100%'
  },
  btnConnect: defaultValues.headerButton
});
