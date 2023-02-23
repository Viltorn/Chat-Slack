import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  username: Yup.string(),
  password: Yup.string(),
});

export const SignUpSchema = Yup.object().shape({
  username: Yup
    .string()
    .required('Required')
    .max(20, 'Min3Max20')
    .min(3, 'Min3Max20'),
  password: Yup
    .string()
    .required('Required')
    .min(6, 'Min6'),
  repeatPass: Yup
    .string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Identical'),
});

export const ChannelSchema = (channelNames) => Yup.object({
  channel: Yup
    .string()
    .notOneOf(channelNames, 'Unique')
    .max(20, 'Min3Max20')
    .min(3, 'Min3Max20'),
});
