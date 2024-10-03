import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { useRouter } from 'expo-router';

const HomeIcon = (props: any) => (
  <Icon {...props} name='home-outline' />
);

const SearchIcon = (props: any) => (
  <Icon {...props} name='search-outline' />
);

const BottomNav = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = (index: number) => {
    setSelectedIndex(index);
    if (index === 0) {
      router.replace('/home/home');
    } else if (index === 1) {
      router.replace('/home/search');
    }
  };

  return (
    <BottomNavigation selectedIndex={selectedIndex} onSelect={onSelect}>
      <BottomNavigationTab title='Home' />
      <BottomNavigationTab title='Search' />
    </BottomNavigation>
  );
};

export default BottomNav;