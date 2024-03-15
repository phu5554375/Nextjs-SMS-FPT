import { Button, Tag } from 'antd';
import { Fragment, useCallback, useEffect, useState } from 'react';

export default function TagSelectGroup({
  items,
  onSelectionChange,
  defaultSelectedAll,
  isReset,
}: any) {
  const [selected, setSelected] = useState(new Set());
  const [isAllSelected] = useState(defaultSelectedAll || false);

  const handleClick = useCallback(
    (id: any) => {
      const newSelected = new Set(selected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelected(newSelected);
      onSelectionChange(Array.from(newSelected));
    },
    [selected, onSelectionChange],
  );

  const handleSelectAll = useCallback(() => {
    const isAllSelected = selected.size === items.length;
    let newSelected;
    if (isAllSelected) {
      newSelected = new Set();
    } else {
      newSelected = new Set(items.map((data: any) => data.value));
    }
    setSelected(newSelected);
    onSelectionChange(Array.from(newSelected));
  }, [selected, items, onSelectionChange]);

  useEffect(() => {
    if (isAllSelected || isReset) {
      if (selected.size !== items.length) {
        handleSelectAll();
      }
    }
  }, [isAllSelected, items, isReset]);

  return (
    <Fragment>
      {items.map((item: any) => (
        <Tag
          className="pointer mr-8 fw-400"
          onClick={() => handleClick(item.value)}
          key={item.value}
          color={selected.has(item.value) ? 'blue' : ''}
        >
          {item.label}
        </Tag>
      ))}
      <Button
        type="link"
        onClick={handleSelectAll}
        style={{ padding: 0, fontWeight: 600 }}
      >
        All
      </Button>
    </Fragment>
  );
}
