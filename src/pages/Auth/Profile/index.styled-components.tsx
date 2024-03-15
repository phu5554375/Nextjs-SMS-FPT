import { styled } from '@umijs/max';

const Wrapper = styled.div`
  h1 {
    background: rgb(121, 184, 242);
  }
`;

export default function Page() {
  return (
    <Wrapper>
      <h1>Page index</h1>
    </Wrapper>
  );
}
