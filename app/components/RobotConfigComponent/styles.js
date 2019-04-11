import { StyleSheet } from 'react-native';
import { defaultValues } from 'components/appStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultValues.appBackground,
  },
  listContainer: {
    paddingHorizontal: 50
  },
  listContentStyle: {
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    margin: 20
  },
  itemLabel: {
    fontSize: 16,
    color: 'white',
    marginVertical: 10
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  itemPropsContainer: {
    flex: 1,
    ...defaultValues.cardCorners,
    ...defaultValues.shadow,
    paddingHorizontal: 10,
    margin: 15,
    paddingBottom: 20
  },
  dialogInput: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: defaultValues.appPrimary,
    borderWidth: 1,
    color: 'white',
    marginVertical: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  configPicker: {
    color: 'white',
    paddingHorizontal: 30,
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: defaultValues.appPrimary,
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 30,
    paddingVertical: 10,
    marginTop: 10
  },
  configLabel: {
    color: 'white',
    top: 18,
    left: 15,
    backgroundColor: defaultValues.appBackground,
    zIndex: 5,
    width: 60,
    textAlign: 'center',
    borderRadius: 5,
    ...defaultValues.shadow
  }
});
