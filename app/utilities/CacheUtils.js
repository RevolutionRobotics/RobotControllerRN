import AsyncStorage from '@react-native-community/async-storage';

export default class CacheUtils {

  static cachedData = [
    { key: 'assignments',     action: 'setAssignments'     },
    { key: 'savedList',       action: 'setBlocklyList'     },
    { key: 'savedConfigList', action: 'setRobotConfigList' },
    { key: 'lastDevice',      action: 'setLastDevice'      }
  ];
  
  static readCache = props => {
    CacheUtils.cachedData.forEach(item => AsyncStorage.getItem(item.key)
      .then(data => {
        if (data && props[item.action]) {
          try {
            props[item.action](JSON.parse(data));
          } catch (err) {
            props[item.action](data);
          }
        }
      }));
  };
}

