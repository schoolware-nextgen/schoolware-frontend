import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, SectionList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TextInput } from '@/components/Themed';
import React, { useEffect } from 'react';
import { Schoolware } from '@/components/schoolware';
import { useRouter } from 'expo-router';
import Toast from 'react-native-root-toast';
import { Button, Card, RadioButton, Title } from 'react-native-paper';








export default function ModalScreen() {
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [isUsernameValid, setIsUsernameValid] = React.useState(false);

  var [password, setPassword] = React.useState('');
  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  var [domain, setDomain] = React.useState('');
  const [isDomainValid, setIsDomainValid] = React.useState(false);

  var [saveDisabled, setsaveDisabled] = React.useState(true);

  const [accountType, setAccountType] = React.useState('Microsoft');

  const validateUsername = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setIsUsernameValid(validateUsername(text));

    if (username !== "" && password !== "" && domain !== "") {
      setsaveDisabled(false)
    } else { setsaveDisabled(true) }
  };


  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (text == "") {
      setIsPasswordValid(false)
    }
    else {
      setIsPasswordValid(true)
    }
    if (username !== "" && password !== "" && domain !== "") {
      setsaveDisabled(false)
    } else { setsaveDisabled(true) }
  }

  const handleDomainChange = (text: string) => {
    setDomain(text);
    setIsDomainValid(validateDomain(text));
    if (username !== "" && password !== "" && domain !== "") {
      setsaveDisabled(false)
    } else { setsaveDisabled(true) }
  };

  const validateDomain = (url: string): boolean => {
    const re = /^(?!https:\/\/)(?!.*\/$)([^\s$.?#].[^\s]*)$/i;
    return re.test(url);
  };

  const handleAccountTypeChange = (value: string) => {
    setAccountType(value);
  }

  async function onSubmit() {
    if (username !== "" && password !== "" && domain !== "") {

      const schoolware = new Schoolware(username, password, domain, undefined, undefined, accountType);
      await schoolware.login()
      let succes = await schoolware.checkToken()
      if (succes) {
        AsyncStorage.setItem('username', username);
        AsyncStorage.setItem('password', password);
        AsyncStorage.setItem('domain', domain);
        AsyncStorage.setItem('accountType', accountType);
        router.replace('/');
      }
      else {
        console.log("showing toast")
        Toast.show('Bad username or password, try again', {
          duration: Toast.durations.LONG,
        });
        setIsUsernameValid(false);
        setIsPasswordValid(false);
      }
    } else {
      Toast.show('not all manditory fields filled', {
        duration: Toast.durations.LONG,
      });
    }

  }

  async function loadSettings() {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    const domain = await AsyncStorage.getItem('domain');
    const accountType = await AsyncStorage.getItem('accountType');
    if (username !== null && password !== null && domain !== null) {
      setUsername(username);
      setPassword(password);
      setDomain(domain);
      setAccountType(accountType);

      handleUsernameChange(username);
      handlePasswordChange(password);
      handleDomainChange(domain);
      handleAccountTypeChange(accountType);

      setsaveDisabled(false)
    }

  }


  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>username</Title>
          <TextInput
            style={[styles.input, !isUsernameValid && styles.errorInput]}
            placeholder="Enter your email, bv: naam.achternaam@leerling.kov.be"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={username}
            onChangeText={handleUsernameChange}
            keyboardType="email-address"
            autoCapitalize="none"

          />
          {!isUsernameValid && <Text style={styles.errorText}>Invalid email address</Text>}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>password</Title>
          <TextInput
            style={[styles.input, !isPasswordValid && styles.errorInput]}
            onChangeText={handlePasswordChange}
            keyboardType="visible-password"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            autoCapitalize="none"
            value={password}
            placeholder='Enter your password'

          />
          {!isPasswordValid && <Text style={styles.errorText}>Invalid password</Text>}
        </Card.Content>
      </Card>


      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>domain</Title>
          <TextInput
            style={[styles.input, !isDomainValid && styles.errorInput]}
            placeholder="kov.schoolware.be"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={domain}
            onChangeText={handleDomainChange}
            keyboardType="url"
            autoCapitalize="none"

          />
          {!isDomainValid && <Text style={styles.errorText} >Invalid URL</Text>}
        </Card.Content>
      </Card>


      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>type</Title>
          <RadioButton.Group onValueChange={value => handleAccountTypeChange(value)} value={accountType}>
            <RadioButton.Item label="Schoolware" value="schoolware" />
            <RadioButton.Item label="Microsoft" value="microsoft" />
          </RadioButton.Group>


          {!isDomainValid && <Text style={styles.errorText} >Invalid URL</Text>}
        </Card.Content>
      </Card>

      <Button style={styles.button} icon="floppy" mode="contained" onPress={onSubmit} disabled={saveDisabled}>
        Save
      </Button>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgb(25, 25, 25)"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '50%',
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 40,
    width: "80%",
    maxWidth: 500,
    color: "rgb(255, 255, 255)",
    margin: 'auto'
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  },
  button: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  errorInput: {
    borderColor: 'red',
    color: "rgb(255, 255, 255)"
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: "center"
  },
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
    paddingBottom: 5,
    width: Platform.OS === 'web' ? '60%': '90%',
    textAlign: 'center',
    maxWidth: 550,
    borderRadius: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
