import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {selectCurrentComment} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';

const ReportScreen = () => {
  const [reportText, setReportText] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const currentComment = useAppSelector(selectCurrentComment);

  const handleReportSubmit = () => {
    // const report = {
    //     videoId : video.id,
    //     reporterId: user.id,
    //     reason: reportText,
    //     description: reportDescription,
    // };
  };

  return (
    <View>
      <Text>Report User</Text>
      <TextInput
        placeholder="Enter Reason for Report"
        value={reportText}
        onChangeText={setReportText}
      />

      <TextInput
        placeholder="Enter DESCRIPTION for Report"
        value={reportDescription}
        onChangeText={setReportDescription}
      />
      <Button title="Submit" onPress={handleReportSubmit} />
    </View>
  );
};

export default ReportScreen;
